/*
 * Copyright Â© 2023 Free Term Of Use bc ConMaster2112
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software. You must include and keep this
 * copyright notice in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Vector3 } from "@minecraft/server";


interface Vec3 {
    x: number;
    y: number;
    z: number;
    /**
    * Calculates projection of 'a' onto 'b'
    * @this {this}-First Vector to project onto second Vector
    * @param vec-Second Vector onto which first is projected
    * @returns -The projection of 'a' onto 'b'
    */
    projection(vec: Vector3): Vec3;
    /**
    * Calculates rejection of 'a' from 'b'
    * @this {this}-First Vector to reject from second Vector
    * @param vec-Second Vector from which first is rejected
    * @returns -The rejection of 'a' from 'b'
    */
    rejection(vec: Vector3): Vec3;
    /**
    * Calculates distance between two points
    * @this {this}-First point represented as a vector
    * @param vec-Second point represented as a vector
    * @returns -The distance between points represented by vectors 'a' and 'b'
    */
    distance(vec: Vector3): number; /**
    * Reflects a vector across a given normal vector.
    * @this {this} - The vector to reflect.
    * @param vec - The normal vector to reflect across.
    * @returns  The reflected vector.
    */
    reflect(vec: Vector3): Vec3;
    /**
     * Calculates the linear interpolation between two vectors.
     * @this {this} - The first vector.
     * @param vec - The second vector.
     * @param t - The interpolation parameter. Should be between 0 and 1.
     * @returns  The interpolated vector.
     */
    lerp(vec: Vector3, t: number): Vector3;
    /**
     * Calculates the cross product of two vectors.
     * @this {this} - The first vector.
     * @param vec - The second vector.
     * @returns  The cross product of the two vectors.
     */
    cross(vec: Vector3): Vec3;
    /**
     * Calculates the dot product of two vectors.
     * @this {this} - The first vector.
     * @param vec - The second vector.
     * @returns The dot product of the two vectors.
     */
    dot(vec: Vector3): number;
    /**
     * Adds two vectors.
     * @this {this} - The first vector.
     * @param vec - The second vector.
     * @returns  The sum of the two vectors.
     */
    add(vec: Vector3): Vec3;
    /**
     * Subtracts the second vector from the first vector.
     * @this {this} - The first vector.
     * @param vec - The second vector.
     * @returns  The difference of the two vectors.
     */
    subtract(vec: Vector3): Vec3;
    /**
     * Multiplies a vector by a scalar value.
     * @this {this} - The vector to be multiplied.
     * @param num - The scalar value or vector to multiply the vector by.
     * @returns  The product of the vector and the scalar value.
     */
    multiply(num: number | Vector3): Vec3;
    floor(): Vec3;
    ceil(): Vec3;
    readonly length: number;
    readonly normalized: Vec3;
}
type Vec3Constructor =  {
    new(x: number, y?: number, z?: number): Vec3;
    (x: number, y?: number, z?: number): Vec3;
    /**
     * Adds two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns  The sum of the two vectors.
     */
    add(a: Vector3, b: Vector3): Vec3;
    /**
     * Subtracts the second vector from the first vector.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns  The difference of the two vectors.
     */
    subtract(a: Vector3, b: Vector3): Vec3;
    /**
     * Multiplies a vector by a scalar value.
     * @param v - The vector to be multiplied.
     * @param n - The vector or scalar value to multiply the vector by.
     * @returns  The product of the vector and the scalar value.
     */
    multiply(v: Vector3, n: number | Vector3): Vec3;
    /**
    * Calculates magnitude (length) of given vector
    * @param a-The vector to calculate magnitude of
    * @returns -The magnitude (length) of given vector
    */
    magnitude(vec: Vector3): number;
    /**
    * Normalizes given vector to have magnitude (length) of 1
    * @param a-The vector to normalize
    * @returns -The normalized vector
    */
    normalize(vec: Vector3): Vec3;
    /**
     * Calculates the cross product of two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns  The cross product of the two vectors.
     */
    cross(a: Vector3, b: Vector3): Vec3;
    /**
     * Calculates the dot product of two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @returns The dot product of the two vectors.
     */
    dot(a: Vector3, b: Vector3): number;
    /**
    * Calculates angle between two vectors in radians
    * @param a-The first vector
    * @param b-The second vector
    * @returns -The angle between two vectors in radians
    */
    angleBetween(a: Vector3, b: Vector3): number;

    /**
    * Calculates projection of 'a' onto 'b'
    * @param a-First Vector to project onto second Vector
    * @param b-Second Vector onto which first is projected
    * @returns -The projection of 'a' onto 'b'
    */
    projection(a: Vector3, b: Vector3): Vec3;
    /**
    * Calculates rejection of 'a' from 'b'
    * @param a-First Vector to reject from second Vector
    * @param b-Second Vector from which first is rejected
    * @returns -The rejection of 'a' from 'b'
    */
    rejection(a: Vector3, b: Vector3): Vec3;
    /**
    * Calculates distance between two points
    * @param a-First point represented as a vector
    * @param b-Second point represented as a vector
    * @returns -The distance between points represented by vectors 'a' and 'b'
    */
    distance(a: Vector3, b: Vector3): number; /**
    * Reflects a vector across a given normal vector.
    * @param v - The vector to reflect.
    * @param n - The normal vector to reflect across.
    * @returns  The reflected vector.
    */
    reflect(v: Vector3, n: Vector3): Vec3;
    /**
     * Calculates the linear interpolation between two vectors.
     * @param a - The first vector.
     * @param b - The second vector.
     * @param t - The interpolation parameter. Should be between 0 and 1.
     * @returns  The interpolated vector.
     */
    lerp(a: Vector3, b: Vector3, t: number): Vector3;
    floor(vec: Vector3): Vec3;
    ceil(vec: Vector3): Vec3;
    from(object: any): Vec3;
    sort(vec1: Vector3, vec2: Vector3): [Vec3, Vec3];
    isVec3(vec: any): vec is Vec3;
    invert(vec: Vector3): Vec3;
    readonly down: Vec3;
    readonly up: Vec3;
    readonly right: Vec3;
    readonly left: Vec3;
    readonly forward: Vec3;
    readonly backward: Vec3;
    readonly zero: Vec3;
    readonly prototype: Vec3;
};
export declare var Vec3: Vec3Constructor;
